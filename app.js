const express = require('express');
const path = require('path');
const conn = require('./conn');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Registration form
app.get('/', (req, res) => {
    res.render('index');
});

// CREATE: after saving, go back to the registration form
app.post('/register', (req, res) => {
    const { ln, fn, age } = req.body;

    const insert = 'INSERT INTO info VALUES (0, ?, ?, ?)';

    conn.query(insert, [ln, fn, age], (err) => {
        if (err) throw err;
        res.send(
            `<script>
                alert('data:inserted');
                location.href='/';
            </script>`
        );
    });
});

// READ
app.get('/view', (req, res) => {
    conn.query('SELECT * FROM info', (err, data) => {
        if (err) throw err;
        res.render('list', { student: data });   // 'students' with an s
    });
});

// UPDATE: show the form pre-filled
app.get('/edit/:id', (req, res) => {
    conn.query('SELECT * FROM info WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) throw err;
        if (rows.length === 0) return res.status(404).send('Student not found');
        res.render('index', { data: rows[0] });
    });
});

// DELETE
app.get('/delete/:id', (req, res) => {
    conn.query('DELETE FROM info WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.send(
            `<script>
                alert('data:deleted');
                location.href='/list';
            </script>`
        );
    });
});

app.listen(9000, () => {
    console.log('Server running at http://localhost:9000');
});