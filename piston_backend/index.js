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
            const result =(language==="cpp")? await piston.execute('cpp', code, { language: 'cpp', version: '10.2.0', stdin: input }) : await piston.execute(language, code, { stdin: input });
            console.log(result);
            results.push(result.run.output);
        } catch (error) {
            console.error(error);
            results.push(`${error.message || 'Error executing'}`);
        }
    }
    return res.json({ output: results });
});


app.post('/submit-code', async (req, res) => {
    const { language, code, inputs, correctLanguage, correctCode } = req.body;

    let results = [];

    // Execute the correct code to get expected outputs
    let expectedOutputs = [];
    for (const input of inputs) {
        try {
            const correctResult = correctLanguage!=="cpp"? await piston.execute(correctLanguage, correctCode, { stdin: input }) : await piston.execute('cpp', correctCode, { language: 'cpp', version: '10.2.0', stdin: input });
            expectedOutputs.push(correctResult.run.output || 'No output');
        } catch (error) {
            expectedOutputs.push(`Error: ${error.message || 'Error executing correct code'}`);
        }
    }

    // Execute the user's code and compare outputs
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        try {
            const result =(language==="cpp")? await piston.execute('cpp', code, { language: 'cpp', version: '10.2.0', stdin: input }) : await piston.execute(language, code, { stdin: input });
            const userOutput = result.run.output || 'No output';
            const expectedOutput = expectedOutputs[i];

            // Compare user output with expected output
            const match = userOutput === expectedOutput;
            results.push({
                input,
                userOutput,
                expectedOutput,
                match
            });
        } catch (error) {
            results.push({
                input,
                userOutput: `Error: ${error.message || 'Error executing user code'}`,
                expectedOutput: expectedOutputs[i],
                match: false
            });
        }
    }
    return res.json({ results });
});


app.listen(7777, () => {
    console.log('Server is running on http://localhost:7777');
});
