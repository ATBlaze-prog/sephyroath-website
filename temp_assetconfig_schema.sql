COPY (SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name='AssetConfig' ORDER BY ordinal_position) TO STDOUT WITH CSV HEADER;
