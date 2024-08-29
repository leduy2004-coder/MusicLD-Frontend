import actionTypes from "./ActionType";
export const setCurSongId = (sid) => ({
    type : actionTypes.SET_CUR_SONG_ID,
    sid
})

export const play = (flag) => ({
    type : actionTypes.PLAY,
    flag
})
export const playAlbum = (flag) => ({
    type : actionTypes.SET_ALBUMS,
    flag
})

export const setPlaylist = (songs) => ({
    type : actionTypes.PLAYLIST,
    songs
})

export const setCurSongData = (data) =>({
    type: actionTypes.SET_CUR_SONG_DATA,
    data
})

export const setCurAlbumId = (pid) =>({
    type: actionTypes.SET_CUR_ALBUM_ID,
    pid
})

export const setRecent = (data) =>({
    type: actionTypes.SET_RECENT,
    data
})
