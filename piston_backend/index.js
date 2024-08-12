import express from 'express';
import Piston from 'piston-client';
import cors from 'cors';

const piston = Piston();
const app = express();

app.use(cors());
app.use(express.json());

app.post('/run-code', async (req, res) => {
    const { language, code, inputs } = req.body;

    let results = [];
    for (const input of inputs) {
        try {
            const result = await piston.execute(language, code, { stdin: input });
            results.push(result.run.output);
        } catch (error) {
            results.push(`${error.message || 'Error executing'}`);
        }
    }
    return res.json({ output: results });
});

app.listen(7777, () => {
    console.log('Server is running on http://localhost:7777');
});
