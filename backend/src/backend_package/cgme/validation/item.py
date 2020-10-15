class Item:
    @classmethod
    def from_record(cls, record):
        p = Item()
        for key, value in record.items():
            setattr(p, key, value)
        return p
