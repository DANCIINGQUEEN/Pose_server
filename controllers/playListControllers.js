import playListModel from "../models/playList.js";

const playListControl = {
  holy: async (req, res) => {
    res.json({
      success: "i love you",
    });
  },
  create: async (req, res) => {
    const data = new playListModel(req.body);
    // Save the data to the database
    await data.save((error) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.send("Data saved successfully!");
      }
    });
  },
  getAll: async (req, res) => {
    try{
        let playList=await playListModel.find()
        playList=playList.reverse()
        res.status(200).json(playList)
    }catch(err){
        res.status(500).json(err)
    }
  },
  getOne: async (req, res) => {
    try{
        let playList=await playListModel.find()
        playList=playList.reverse()
        playList=playList[0]
        res.status(200).json({playList})
    }catch(err){
        res.status(500).json(err)
    }
  },
  findPlayListByDate: async (req, res) => {
    try {
      const { date } = req.params;

      const PlayList = await playListModel.findOne({ date: date });

      if (!PlayList) {
        return res.status(404).json({ error: "PlayList not found" });
      }

      res.json(PlayList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default playListControl;
