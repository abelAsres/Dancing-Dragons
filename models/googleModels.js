export class YouTubePlaylist {
    constructor(kind, id, snippet, channelTitile) {
        this.kind = kind;
        this.id = id;
        this.snippet = snippet;
        this.channelTitile = channelTitile;
    }
}

export class YouTubePlaylistItem {
    constructor(id, snippet, resourceId, playlistId) {
        this.id = id;
        this.snippet = snippet;
        this.resourceId = resourceId;
        this.playlistId = playlistId;
    }
}
