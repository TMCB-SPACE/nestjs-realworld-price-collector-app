CREATE TABLE IF NOT EXISTS logging.http_logs (
    id UUID default generateUUIDv4(),
    complete UInt8 default 0,
    startTime DateTime(3) default now(),
    duration UInt32 default 0,
    statusCode UInt16 default 0,
    statusMessage String default '',
    reqId String,
    hostname String,
    protocol String,
    ip String,
    method String,
    originalUrl String,
    query String,
    headers String,
    summary String
) ENGINE = MergeTree()
ORDER BY (id, startTime);
