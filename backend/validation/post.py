class Post:
    @classmethod
    def from_record(cls, record):
        p = Post()
        for key, value in record.items():
            setattr(p, key, value)
        return p
