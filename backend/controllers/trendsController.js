const mssql = require("mssql");
const { sqlConfig } = require("../config/config");

const getTrendingWords = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig);

        // Execute the stored procedure to get comments and post captions
        const result = await pool
            .request()
            .execute('getCommentsAndPostCaptionsProc');

        // Combine comments and post captions into one array
        const combinedTextData = result.recordset
            .map((item) => item.comment_text || item.post_caption)
            .join(' ');

        // Tokenize and preprocess the text data
        const words = combinedTextData
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
            .split(/\s+/);

        const conjunctionWords = ["and", "this", "is", "to", "a", "not", "nor", "but", "or", "if", "while", "because", "although", "since", "unless", "when", "whereas", "whether", "until", "before", "after", "since", "as", "so", "than", "while", "whether", "though", "unless", "yet"];

        // Filter out conjunction words from the words array
        const filteredWords = words.filter((word) => !conjunctionWords.includes(word));

        // Count word frequencies in the filtered text data and store in an object list
        const wordFrequency = {};
        filteredWords.forEach((word) => {
            if (!wordFrequency[word]) {
                wordFrequency[word] = 1;
            } else {
                wordFrequency[word]++;
            }
        });

        // Sort words by frequency in descending order
        const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);

        // Select the top 8 words as trends
        const topTrends = sortedWords.slice(0, 8);

        return res.status(200).json({ trends: topTrends });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getTrendingWords };
