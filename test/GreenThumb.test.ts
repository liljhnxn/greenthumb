import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { GreenThumb } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GreenThumb Smart Contract", function () {
  let greenThumb: GreenThumb;
  let owner: SignerWithAddress;
  let gardener1: SignerWithAddress;
  let gardener2: SignerWithAddress;

  beforeEach(async function () {
    [owner, gardener1, gardener2] = await ethers.getSigners();
    const GreenThumbFactory = await ethers.getContractFactory("GreenThumb");
    greenThumb = (await GreenThumbFactory.deploy()) as GreenThumb;
    await greenThumb.waitForDeployment();
  });

  describe("Publishing Tips", function () {
    it("should allow a gardener to publish a gardening tip", async function () {
      const tx = await greenThumb.connect(gardener1).publishTip(
        "How to Water Monstera",
        "Monstera Deliciosa",
        "Indoor Plants",
        "Allow the top 2-3 inches of soil to dry out between waterings.",
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b"
      );

      await expect(tx)
        .to.emit(greenThumb, "TipPublished")
        .withArgs(
          1,
          gardener1.address,
          "How to Water Monstera",
          "Monstera Deliciosa",
          "Indoor Plants",
          (val: any) => typeof val === "bigint" || typeof val === "number"
        );

      expect(await greenThumb.totalTips()).to.equal(1);

      const allTips = await greenThumb.getAllTips();
      expect(allTips.length).to.equal(1);
      expect(allTips[0].title).to.equal("How to Water Monstera");
      expect(allTips[0].author).to.equal(gardener1.address);
      expect(allTips[0].plantName).to.equal("Monstera Deliciosa");
      expect(allTips[0].category).to.equal("Indoor Plants");
      expect(allTips[0].likesCount).to.equal(0);
      expect(allTips[0].exists).to.be.true;
    });

    it("should allow tip with empty optional imageUrl", async function () {
      await greenThumb.connect(gardener1).publishTip(
        "Pruning Tomato Suckers",
        "Solanum lycopersicum",
        "Vegetables",
        "Pinch off side shoots when small for bigger fruits.",
        ""
      );

      const tip = await greenThumb.getTip(1);
      expect(tip.imageUrl).to.equal("");
      expect(tip.title).to.equal("Pruning Tomato Suckers");
    });

    it("should revert if required fields are empty", async function () {
      await expect(
        greenThumb.connect(gardener1).publishTip(
          "",
          "Plant Name",
          "Indoor Plants",
          "Description",
          ""
        )
      ).to.be.revertedWithCustomError(greenThumb, "EmptyField");

      await expect(
        greenThumb.connect(gardener1).publishTip(
          "Title",
          "",
          "Indoor Plants",
          "Description",
          ""
        )
      ).to.be.revertedWithCustomError(greenThumb, "EmptyField");

      await expect(
        greenThumb.connect(gardener1).publishTip(
          "Title",
          "Plant",
          "",
          "Description",
          ""
        )
      ).to.be.revertedWithCustomError(greenThumb, "EmptyField");

      await expect(
        greenThumb.connect(gardener1).publishTip(
          "Title",
          "Plant",
          "Indoor Plants",
          "",
          ""
        )
      ).to.be.revertedWithCustomError(greenThumb, "EmptyField");
    });
  });

  describe("Liking and Unliking Tips", function () {
    beforeEach(async function () {
      await greenThumb.connect(gardener1).publishTip(
        "Succulent Soil Mix",
        "Echeveria",
        "Indoor Plants",
        "Use 50% potting soil and 50% perlite or pumice for drainage.",
        "https://images.unsplash.com/photo-1509423350716-97f9360b4e09"
      );
    });

    it("should allow users to like a tip and track like counts", async function () {
      const tx = await greenThumb.connect(gardener2).likeTip(1);

      await expect(tx)
        .to.emit(greenThumb, "TipLiked")
        .withArgs(1, gardener2.address, 1);

      expect(await greenThumb.totalLikes()).to.equal(1);

      const tip = await greenThumb.getTip(1);
      expect(tip.likesCount).to.equal(1);
      expect(await greenThumb.hasUserLiked(1, gardener2.address)).to.be.true;
    });

    it("should prevent duplicate likes from the same wallet", async function () {
      await greenThumb.connect(gardener2).likeTip(1);

      await expect(
        greenThumb.connect(gardener2).likeTip(1)
      ).to.be.revertedWithCustomError(greenThumb, "AlreadyLiked");
    });

    it("should allow a user to unlike a previously liked tip", async function () {
      await greenThumb.connect(gardener2).likeTip(1);
      expect(await greenThumb.totalLikes()).to.equal(1);

      const tx = await greenThumb.connect(gardener2).unlikeTip(1);

      await expect(tx)
        .to.emit(greenThumb, "TipUnliked")
        .withArgs(1, gardener2.address, 0);

      expect(await greenThumb.totalLikes()).to.equal(0);
      const tip = await greenThumb.getTip(1);
      expect(tip.likesCount).to.equal(0);
      expect(await greenThumb.hasUserLiked(1, gardener2.address)).to.be.false;
    });

    it("should revert if unliking a tip not liked yet", async function () {
      await expect(
        greenThumb.connect(gardener2).unlikeTip(1)
      ).to.be.revertedWithCustomError(greenThumb, "NotLikedYet");
    });

    it("should revert if liking a non-existent tip", async function () {
      await expect(
        greenThumb.connect(gardener2).likeTip(999)
      ).to.be.revertedWithCustomError(greenThumb, "TipNotFound");
    });
  });

  describe("Removing Tips", function () {
    beforeEach(async function () {
      await greenThumb.connect(gardener1).publishTip(
        "Herb Garden Basics",
        "Basil & Rosemary",
        "Plant Care",
        "Give them at least 6 hours of full sun daily.",
        ""
      );
      // Like it once
      await greenThumb.connect(gardener2).likeTip(1);
    });

    it("should allow only the author to remove the tip", async function () {
      await expect(
        greenThumb.connect(gardener2).removeTip(1)
      ).to.be.revertedWithCustomError(greenThumb, "NotTipAuthor");

      const tx = await greenThumb.connect(gardener1).removeTip(1);
      await expect(tx)
        .to.emit(greenThumb, "TipRemoved")
        .withArgs(1, gardener1.address);

      expect(await greenThumb.totalTips()).to.equal(0);
      expect(await greenThumb.totalLikes()).to.equal(0);

      const allTips = await greenThumb.getAllTips();
      expect(allTips.length).to.equal(0);

      await expect(greenThumb.getTip(1)).to.be.revertedWithCustomError(
        greenThumb,
        "TipNotFound"
      );
    });
  });
});
