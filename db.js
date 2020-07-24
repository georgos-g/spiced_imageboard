const spicedPG = require('spiced-pg');
const { query } = require('express');
const db = spicedPG('postgres:georgos:georgos@localhost:5432/imageboard')
//(process.env.DATABASE_URL || 'postgres:georgos:georgos@localhost:5432/imageboard');


exports.getImages = () => {
    return db.query
        //order files in json
        ('SELECT * FROM images ORDER BY created_at DESC;').then(result => {
            return result.rows;
        });
    
};

exports.addImage = (url, username, title, description) => {
    return db.query('INSERT INTO images (url, username, title, description VALUES($1, $2, $3, $4) RETURNING *;',
        [url, username, title, description]);
    
};