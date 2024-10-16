import pymongo

# เชื่อมต่อ MongoDB
url = 'mongodb://localhost:27017'
client = pymongo.MongoClient(url)

# database name
db = client['projectSIDev']

# table products
products_collection = db['products']