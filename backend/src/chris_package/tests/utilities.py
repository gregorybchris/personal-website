def get_public_class_members(c):
    public_members = [a for a in vars(c) if not a.startswith('_')]
    return [getattr(c, a) for a in public_members if not callable(getattr(c, a))]
