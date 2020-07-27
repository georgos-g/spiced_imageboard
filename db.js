const spicedPG = require('spiced-pg');
const db = spicedPG('postgres:georgos:georgos@localhost:5432/imageboard');
//const db= spicedPG(process.env.DATABASE_URL || 'postgres:georgos:georgos@localhost:5432/imageboard');


exports.getImages = () => {
    return db.query('SELECT * FROM images ORDER BY created_at DESC;').then((result) => {
        return result.rows;
    });
    
};

exports.addImage = (url, username, title, description) => {
    return db.query('INSERT INTO images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING *;',
        [url, username, title, description]);
    
};



exports.getOverlayImage = (imageId) => {
    return db.query(`SELECT * FROM images WHERE id = $1;`,
        [imageId])
        .then((result) => {
            return result.rows [0];
        });
};