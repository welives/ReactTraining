const mysql = require('mysql')

// 创建一个数据库连接对象
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
// 建立连接
db.connect((err) => {
  if (err) {
    console.error('MySQL连接失败: ' + err.stack)
    return
  }
  console.log('MySQL连接成功,id为' + db.threadId)
})

// 用户表
db.query(
  `CREATE TABLE IF NOT EXISTS users(
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  username varchar(45) NOT NULL COMMENT '用户名',
  email varchar(255) NOT NULL COMMENT '邮箱',
  password varchar(255) NOT NULL COMMENT '密码',
  avatar varchar(255) DEFAULT NULL COMMENT '头像',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';`,
  (err, res) => {
    if (err) throw err
  }
)

// 分类表
db.query(
  `CREATE TABLE IF NOT EXISTS categories(
  id tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
  \`key\` varchar(30) NOT NULL DEFAULT '' COMMENT '键',
  label varchar(100) NOT NULL DEFAULT '' COMMENT '描述',
  pid tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '父级',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';`,
  (err, res) => {
    if (err) throw err
  }
)

// 文章表
db.query(
  `CREATE TABLE IF NOT EXISTS posts(
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  content text COMMENT '内容',
  cover varchar(255) NOT NULL DEFAULT '' COMMENT '封面',
  cover_uuid varchar(150) NOT NULL DEFAULT '' COMMENT '附件资源id',
  category_id tinyint(4) unsigned NOT NULL COMMENT '分类id',
  category_key varchar(30) NOT NULL DEFAULT '' COMMENT '分类key',
  user_id int(10) unsigned NOT NULL COMMENT '作者',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_uid (user_id),
  KEY fk_cid (category_id),
  CONSTRAINT fk_cid FOREIGN KEY (category_id) REFERENCES categories (id),
  CONSTRAINT fk_uid FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';`,
  (err, res) => {
    if (err) throw err
  }
)

// 附件表
db.query(
  `CREATE TABLE IF NOT EXISTS attachments(
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  uuid varchar(150) NOT NULL COMMENT '资源id',
  type varchar(50) NOT NULL DEFAULT '' COMMENT '类型',
  mime_type varchar(50) DEFAULT NULL,
  size double unsigned NOT NULL COMMENT '文件大小,单位字节',
  width int(10) DEFAULT NULL COMMENT '图片宽度',
  height int(10) DEFAULT NULL COMMENT '图片高度',
  original_name varchar(255) NOT NULL COMMENT '文件原始名字',
  save_path varchar(255) NOT NULL COMMENT '保存路径',
  memo varchar(255) DEFAULT NULL COMMENT '备注',
  user_id int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上传者',
  created_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='附件表';`,
  (err, res) => {
    if (err) throw err
  }
)

module.exports = db
