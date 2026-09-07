from database import get_db

conn = get_db()
cursor = conn.cursor()
cursor.execute("DELETE FROM documents WHERE filename LIKE '%.class' OR length(source_text) < 10")
conn.commit()
print("Cleaned corrupted binary rows:", cursor.rowcount)
