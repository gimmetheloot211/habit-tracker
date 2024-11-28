const axios = require("axios");

const getApiData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.api-ninjas.com/v1/quotes?category=courage",
      {
        headers: {
          "X-Api-Key": process.env.API_NINJA_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
};

module.exports = { getApiData };
