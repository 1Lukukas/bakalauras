import { DataTypes, Sequelize } from 'sequelize'

function sqlServerToSequelize(sqlType) {
  const typeMap = {
    bigint: DataTypes.BIGINT,
    binary: DataTypes.BLOB,
    bit: DataTypes.BOOLEAN,
    char: DataTypes.CHAR,
    date: DataTypes.DATEONLY,
    datetime: DataTypes.DATE,
    decimal: DataTypes.DECIMAL,
    float: DataTypes.FLOAT,
    geography: DataTypes.GEOGRAPHY,
    geometry: DataTypes.GEOMETRY,
    image: DataTypes.BLOB,
    int: DataTypes.INTEGER,
    money: DataTypes.DECIMAL,
    nchar: DataTypes.CHAR,
    ntext: DataTypes.TEXT,
    numeric: DataTypes.DECIMAL,
    nvarchar: DataTypes.STRING,
    real: DataTypes.REAL,
    smalldatetime: DataTypes.DATE,
    smallint: DataTypes.SMALLINT,
    smallmoney: DataTypes.DECIMAL,
    sql_variant: DataTypes.JSON,
    sysname: DataTypes.STRING,
    text: DataTypes.TEXT,
    time: DataTypes.TIME,
    timestamp: DataTypes.DATE,
    tinyint: DataTypes.TINYINT,
    uniqueidentifier: DataTypes.UUID,
    varbinary: DataTypes.BLOB,
    varchar: DataTypes.STRING
  }

  return typeMap[sqlType.toLowerCase()] || DataTypes.STRING
}
