router.post("/upload-images", upload.array("images", 6), (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const urls = req.files.map((file) => {
      console.log("Uploaded file:", file); // Log file details
      return `http://localhost:3000/${file.path}`;
    });

    console.log("Generated URLs:", urls);
    res.status(200).json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});
