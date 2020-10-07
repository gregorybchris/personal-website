class EventProperties:
    # Field Names

    FIELDS = [
        'event_id',
        'name',
        'date',
        'event_type',
        'content_type',
        'description',
        'has_code',
        'has_download',
        'archived',
    ]

    # Field values

    EVENT_TYPES = [
        'project',
        'employment',
    ]

    CONTENT_TYPES = [
        'game',
        'paper',
        'program',
        'simulation',
        'website',
        'internship',
        'job',
    ]
