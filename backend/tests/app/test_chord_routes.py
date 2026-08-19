import pytest

from chris.app.routes.chord_routes import ChartLine, ChartLineKind, Key, Song, modulate_song

CHART = "C G Am F (x2)\n\n~ chorus\nF C G7/B E7/G#"


def text_of(chart: list[ChartLine]) -> list[str]:
    return [line.text for line in chart]


def kinds_of(chart: list[ChartLine]) -> list[ChartLineKind]:
    return [line.kind for line in chart]


@pytest.fixture(name="keyed_song")
def keyed_song_fixture() -> Song:
    return Song(id="a", title="Keyed", artist="Artist", chords=CHART, key=Key(root="C", mode="major"))


@pytest.fixture(name="keyless_song")
def keyless_song_fixture() -> Song:
    return Song(id="b", title="Keyless", artist="Artist", chords=CHART)


class TestModulateSong:
    def test_keyed_song_modulates_chords_and_key(self, keyed_song: Song) -> None:
        chart, key = modulate_song(keyed_song, 3, symbols=True)
        assert text_of(chart)[0] == "E♭ B♭ Cm A♭ (x2)"
        assert key == {"root": "E♭", "mode": "major"}

    def test_keyed_song_spells_chords_in_the_destination_key(self, keyed_song: Song) -> None:
        # Down a semitone from C lands in B, where the tritone is spelled F♯ rather than G♭.
        chart, key = modulate_song(keyed_song, -1, symbols=True)
        assert text_of(chart)[0] == "B F♯ G♯m E (x2)"
        assert key == {"root": "B", "mode": "major"}

    def test_keyed_song_at_zero_offset_only_adds_symbols(self, keyed_song: Song) -> None:
        chart, key = modulate_song(keyed_song, 0, symbols=True)
        assert text_of(chart)[3] == "F C G7/B E7/G♯"
        assert key == {"root": "C", "mode": "major"}

    def test_keyless_song_ignores_the_offset(self, keyless_song: Song) -> None:
        # With no key there is nothing to spell a transposition against, so the
        # chords come back as written no matter what offset is requested.
        unmodulated, _ = modulate_song(keyless_song, 0, symbols=True)
        for offset in (-5, 1, 7):
            chart, key = modulate_song(keyless_song, offset, symbols=True)
            assert chart == unmodulated
            assert key is None

    def test_symbols_disabled_renders_ascii_accidentals(self, keyed_song: Song) -> None:
        chart, key = modulate_song(keyed_song, 6, symbols=False)
        assert text_of(chart)[0] == "Gb Db Ebm Cb (x2)"
        assert key == {"root": "Gb", "mode": "major"}

    def test_chart_layout_is_preserved(self, keyed_song: Song) -> None:
        chart, _ = modulate_song(keyed_song, 2, symbols=True)
        assert len(chart) == len(CHART.splitlines())
        assert kinds_of(chart) == [
            ChartLineKind.Chords,
            ChartLineKind.Blank,
            ChartLineKind.Comment,
            ChartLineKind.Chords,
        ]
        assert text_of(chart)[2] == "~ chorus"
        assert text_of(chart)[0].endswith(" (x2)")

    def test_unparseable_chart_falls_back_to_the_original(self) -> None:
        song = Song(id="c", title="Bad", artist="Artist", chords="C G ??? F", key=Key(root="C", mode="major"))
        chart, key = modulate_song(song, 3, symbols=True)
        assert text_of(chart) == ["C G ??? F"]
        assert kinds_of(chart) == [ChartLineKind.Chords]
        assert key == {"root": "C", "mode": "major"}


class TestFunctionalAnalysis:
    def test_functions_label_each_chord_line(self, keyed_song: Song) -> None:
        chart, _ = modulate_song(keyed_song, 0, symbols=True, functions=True)
        assert text_of(chart)[:2] == ["I V vi IV", "C G Am F (x2)"]
        assert kinds_of(chart)[:2] == [ChartLineKind.Functions, ChartLineKind.Chords]

    def test_functions_align_with_their_chords(self, keyed_song: Song) -> None:
        # Each chord and its function share a column so the two lines read as a grid.
        chart, _ = modulate_song(keyed_song, 0, symbols=True, functions=True)
        function_line, chord_line = text_of(chart)[4:6]
        assert [function_line, chord_line] == ["IV I V7/VII III7/VI", "F  C G7/B   E7/G♯"]
        assert function_line.index("V7/VII") == chord_line.index("G7/B")

    def test_functions_survive_modulation(self, keyed_song: Song) -> None:
        # A chord's function is a property of the key, so modulating cannot change it.
        unmodulated, _ = modulate_song(keyed_song, 0, symbols=True, functions=True)
        modulated, _ = modulate_song(keyed_song, 5, symbols=True, functions=True)
        assert text_of(modulated)[0] == text_of(unmodulated)[0]

    def test_functions_are_off_by_default(self, keyed_song: Song) -> None:
        chart, _ = modulate_song(keyed_song, 0, symbols=True)
        assert ChartLineKind.Functions not in kinds_of(chart)

    def test_keyless_song_gets_no_functions(self, keyless_song: Song) -> None:
        # Without a key there is no tonic to measure a chord's function against.
        with_functions, _ = modulate_song(keyless_song, 0, symbols=True, functions=True)
        without_functions, _ = modulate_song(keyless_song, 0, symbols=True)
        assert with_functions == without_functions

    def test_blank_lines_get_no_function_line(self, keyed_song: Song) -> None:
        chart, _ = modulate_song(keyed_song, 0, symbols=True, functions=True)
        assert kinds_of(chart) == [
            ChartLineKind.Functions,
            ChartLineKind.Chords,
            ChartLineKind.Blank,
            ChartLineKind.Comment,
            ChartLineKind.Functions,
            ChartLineKind.Chords,
        ]
