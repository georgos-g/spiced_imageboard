const spicedPG = require('spiced-pg');
const db = spicedPG('postgres:georgos:georgos@localhost:5432/imageboard');
//const db= spicedPG(process.env.DATABASE_URL || 'postgres:georgos:georgos@localhost:5432/imageboard');


exports.getImages = (lastImageId) => {
    if (lastImageId > 0) {
        return db
            .query("SELECT * FROM images WHERE id < $1 ORDER BY created_at DESC LIMIT 4;",
                [lastImageId]
            )
            .then((result) => {
                return result.rows;
            });
    } else {
        return db
            .query("SELECT * FROM images ORDER BY created_at DESC LIMIT 4;"
            )
            .then((result) => {
                return result.rows;
            });
    }
};

exports.addImage = (url, username, title, description) => {
    return db
        .query('INSERT INTO images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING *;',
            [url, username, title, description]);
    
};



exports.getOverlayImage = (imageId) => {
    return db
        .query(`SELECT * FROM images WHERE id = $1;`,
            [imageId])
        .then((result) => {
            return result.rows [0];
        });
};

// Comment 
exports.getImgComments = (image_id,) => {
    return db
        .query(`SELECT * FROM comments WHERE image_id = $1`,
            [image_id])
        .then((result) => {
            return result.rows;
            
        });

};

exports.addImgComment = (image_id, username, description) => {
    return db
        .query(`INSERT INTO comments (image_id, username, description) VALUES($1, $2, $3) RETURNING *;`,
            [image_id, username, description])
        .then((result) => {
            return result.rows[0];
            
        });

};
