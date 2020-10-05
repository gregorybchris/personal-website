class EventProperties:
    # Field Names

    FIELDS = [
        'event_id',
        'name',
        'event_date',
        'event_type',
        'content_type',
        'short_description',
        'long_description',
        'deleted',
    ]

    # Field values

    EVENT_TYPES = [
        'project',
    ]

    CONTENT_TYPES = [
        'game',
        'paper',
        'program',
        'simulation',
        'website',
    ]
