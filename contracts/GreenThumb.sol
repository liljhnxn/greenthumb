// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title GreenThumb
 * @notice Decentralized gardening community smart contract for sharing tips,
 *         experiences, and plant care knowledge.
 * @dev "Grow More. Share More."
 */
contract GreenThumb {
    struct Tip {
        uint256 id;
        address author;
        string title;
        string plantName;
        string category;
        string description;
        string imageUrl;
        uint256 timestamp;
        uint256 likesCount;
        bool exists;
    }

    // Counters
    uint256 private _tipIdCounter;
    uint256 public totalTips; // Count of active tips
    uint256 public totalLikes; // Total likes across all active tips

    // Tip ID => Tip
    mapping(uint256 => Tip) public tips;

    // Tip ID => (User Address => Has Liked)
    mapping(uint256 => mapping(address => bool)) public hasLiked;

    // Events
    event TipPublished(
        uint256 indexed tipId,
        address indexed author,
        string title,
        string plantName,
        string category,
        uint256 timestamp
    );
    event TipLiked(uint256 indexed tipId, address indexed user, uint256 newLikesCount);
    event TipUnliked(uint256 indexed tipId, address indexed user, uint256 newLikesCount);
    event TipRemoved(uint256 indexed tipId, address indexed author);

    // Custom errors for gas efficiency and clear reverts
    error TipNotFound();
    error NotTipAuthor();
    error AlreadyLiked();
    error NotLikedYet();
    error EmptyField(string field);

    /**
     * @notice Publish a new gardening tip
     * @param title Title of the gardening tip
     * @param plantName Name of the plant (e.g. Monstera Deliciosa, Tomato)
     * @param category Category (e.g. Indoor Plants, Outdoor Plants, Flowers, Vegetables, Plant Care)
     * @param description Detailed gardening instructions and experience
     * @param imageUrl Optional link to an image of the plant
     */
    function publishTip(
        string calldata title,
        string calldata plantName,
        string calldata category,
        string calldata description,
        string calldata imageUrl
    ) external returns (uint256) {
        if (bytes(title).length == 0) revert EmptyField("title");
        if (bytes(plantName).length == 0) revert EmptyField("plantName");
        if (bytes(category).length == 0) revert EmptyField("category");
        if (bytes(description).length == 0) revert EmptyField("description");

        _tipIdCounter++;
        uint256 newTipId = _tipIdCounter;

        tips[newTipId] = Tip({
            id: newTipId,
            author: msg.sender,
            title: title,
            plantName: plantName,
            category: category,
            description: description,
            imageUrl: imageUrl,
            timestamp: block.timestamp,
            likesCount: 0,
            exists: true
        });

        totalTips++;

        emit TipPublished(
            newTipId,
            msg.sender,
            title,
            plantName,
            category,
            block.timestamp
        );

        return newTipId;
    }

    /**
     * @notice Like a gardening tip. Prevents duplicate likes from the same wallet.
     * @param tipId ID of the tip to like
     */
    function likeTip(uint256 tipId) external {
        Tip storage tip = tips[tipId];
        if (!tip.exists) revert TipNotFound();
        if (hasLiked[tipId][msg.sender]) revert AlreadyLiked();

        hasLiked[tipId][msg.sender] = true;
        tip.likesCount++;
        totalLikes++;

        emit TipLiked(tipId, msg.sender, tip.likesCount);
    }

    /**
     * @notice Unlike a previously liked gardening tip
     * @param tipId ID of the tip to unlike
     */
    function unlikeTip(uint256 tipId) external {
        Tip storage tip = tips[tipId];
        if (!tip.exists) revert TipNotFound();
        if (!hasLiked[tipId][msg.sender]) revert NotLikedYet();

        hasLiked[tipId][msg.sender] = false;
        tip.likesCount--;
        totalLikes--;

        emit TipUnliked(tipId, msg.sender, tip.likesCount);
    }

    /**
     * @notice Remove a gardening tip. Only the tip's author can remove it.
     * @param tipId ID of the tip to remove
     */
    function removeTip(uint256 tipId) external {
        Tip storage tip = tips[tipId];
        if (!tip.exists) revert TipNotFound();
        if (tip.author != msg.sender) revert NotTipAuthor();

        // Adjust total counters
        totalLikes -= tip.likesCount;
        totalTips--;

        tip.exists = false;

        emit TipRemoved(tipId, msg.sender);
    }

    /**
     * @notice Retrieve all active gardening tips
     * @return Array of all active Tip structs
     */
    function getAllTips() external view returns (Tip[] memory) {
        Tip[] memory activeTips = new Tip[](totalTips);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= _tipIdCounter; i++) {
            if (tips[i].exists) {
                activeTips[currentIndex] = tips[i];
                currentIndex++;
            }
        }

        return activeTips;
    }

    /**
     * @notice Retrieve a single tip by ID
     * @param tipId ID of the tip
     */
    function getTip(uint256 tipId) external view returns (Tip memory) {
        Tip memory tip = tips[tipId];
        if (!tip.exists) revert TipNotFound();
        return tip;
    }

    /**
     * @notice Check whether a user has liked a specific tip
     * @param tipId ID of the tip
     * @param user Address of the user to check
     */
    function hasUserLiked(uint256 tipId, address user) external view returns (bool) {
        return hasLiked[tipId][user];
    }

    /**
     * @notice Get current tip counter (total tips ever created)
     */
    function getLatestTipId() external view returns (uint256) {
        return _tipIdCounter;
    }
}

