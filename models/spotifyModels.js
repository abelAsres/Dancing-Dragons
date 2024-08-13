export class SpotifyPlaylist {
    constructor(id, name, tracks) {
        this.id = id;
        this.name = name;
        this.tracks = tracks;
    }
}

export class SpotifyTrack {
    constructor(id, name, artists, album) {
        this.id = id;
        this.name = name;
        this.artists = artists;
        this.album = album;
    }
}
