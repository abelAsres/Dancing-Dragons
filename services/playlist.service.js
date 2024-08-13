import { SpotifyTrack } from "../models/spotifyModels.js";

const addToGooglePlaylist = () => {};

const getGoogleResourceByName = (name) => {};

const getGooglePlaylist = (data) => {
    return;
};

const getSpotifyPlaylistTracks = (spotifyTracks) => {
    let tracks = [];
    for (const trackData of spotifyTracks) {
        let track = {};
        track = new SpotifyTrack(
            trackData.track.id,
            trackData.track.name,
            trackData.track.artists[0].name,
            trackData.track.album.name
        );
        tracks.push(track);
    }
    return tracks;
};

export {
    addToGooglePlaylist,
    getGoogleResourceByName,
    getGooglePlaylist,
    getSpotifyPlaylistTracks,
};
