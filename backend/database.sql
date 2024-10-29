-- Users
CREATE TABLE
  users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );

-- Posts
CREATE TABLE
  posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW ()
  );

-- Comments
CREATE TABLE
  comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts (id),
    user_id INTEGER REFERENCES users (id),
    content TEXT NOT NULL,
    parent_comment_id INTEGER REFERENCES comments (id),
    created_at TIMESTAMP DEFAULT NOW ()
  );

INSERT INTO
  users (username, email, password)
VALUES
  ('Greta90', 'greta@iths.se', 'gret123');

INSERT INTO
  posts (user_id, title, content)
VALUES
  (
    1,
    'css',
    'skriv era bästa css tips & tricks nedan'
  );
