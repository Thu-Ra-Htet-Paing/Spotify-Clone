import cloudinary from "../lib/cloudinary.js";
import Album from "../models/album.model.js";
import Song from "../models/song.model.js";

async function uploadToCloudinary(file) {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to cloudinary");
  }
}

async function createSong(req, res, next) {
  try {
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    if (!req.files || !audioFile || !imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });
    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json({ song });
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
}

async function deleteSong(req, res, next) {
  try {
    const { id } = req.params;
    const song = Song.findById(id);

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
}

async function createAlbum(req, res, next) {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;
    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      releaseYear,
      imageUrl,
    });
    await album.save();

    res.status(201).json({ album });
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
}

async function deleteAlbum(req, res, next) {
  try {
    const { id } = req.params;

    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
}

function checkAdmin(req, res) {
  res.status(200).json({ admin: true });
}

export { createSong, deleteSong, createAlbum, deleteAlbum, checkAdmin };
