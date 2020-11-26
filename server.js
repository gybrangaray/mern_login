const express = require ('express');
const app = express();
const connectToDatabase = require('./config/connectToDatabase');

connectToDatabase();

app.use(express.json({ extended: false })); //allows to you just to make a request and pass some data via for example headers

app.use('/api/users', require('./routes/users'));

app.get( '/', (req,res) => {
        res.send('hello gybran garay,ya esta en git hub el back- end ');
    }
)
const PORT = process.env.PORT || 4300;

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))