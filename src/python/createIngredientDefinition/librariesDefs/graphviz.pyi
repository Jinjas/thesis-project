# graphviz/__init__.pyi

import os
from typing import Any, Iterable, Iterator, Mapping, Sequence


PathLike = str | os.PathLike[str]


class Graph:
    def __init__(
        self,
        name: str | None = ...,
        comment: str | None = ...,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        format: str | None = ...,
        engine: str | None = ...,
        encoding: str | None = "utf-8",
        graph_attr: Mapping[str, str] | None = ...,
        node_attr: Mapping[str, str] | None = ...,
        edge_attr: Mapping[str, str] | None = ...,
        body: Sequence[str] | None = ...,
        strict: bool = ...,
        *,
        renderer: str | None = ...,
        formatter: str | None = ...,
    ) -> None: ...

    @property
    def source(self) -> str: ...

    @property
    def filepath(self) -> str: ...

    def clear(self, keep_attrs: bool = ...) -> None: ...

    def copy(self) -> "Graph": ...

    def attr(
        self,
        kw: str | None = ...,
        _attributes: Mapping[str, str] | None = ...,
        **attrs: str,
    ) -> None: ...

    def node(
        self,
        name: str,
        label: str | None = ...,
        _attributes: Mapping[str, str] | None = ...,
        **attrs: str,
    ) -> None: ...

    def nodes(self, nodes: Iterable[str]) -> None: ...

    def edge(
        self,
        tail_name: str,
        head_name: str,
        label: str | None = ...,
        _attributes: Mapping[str, str] | None = ...,
        **attrs: str,
    ) -> None: ...

    def edges(self, edges: Iterable[tuple[str, str]]) -> None: ...

    def subgraph(
        self,
        graph: "Graph | None" = ...,
        name: str | None = ...,
        comment: str | None = ...,
        graph_attr: Mapping[str, str] | None = ...,
        node_attr: Mapping[str, str] | None = ...,
        edge_attr: Mapping[str, str] | None = ...,
        body: Sequence[str] | None = ...,
    ) -> None: ...

    def pipe(
        self,
        format: str | None = ...,
        renderer: str | None = ...,
        formatter: str | None = ...,
        neato_no_op: bool | int | None = ...,
        quiet: bool = ...,
        *,
        engine: str | None = ...,
        encoding: str | None = ...,
    ) -> bytes | str: ...

    def render(
        self,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        view: bool = ...,
        cleanup: bool = ...,
        format: str | None = ...,
        renderer: str | None = ...,
        formatter: str | None = ...,
        neato_no_op: bool | int | None = ...,
        quiet: bool = ...,
        quiet_view: bool = ...,
        *,
        outfile: PathLike | None = ...,
        engine: str | None = ...,
        raise_if_result_exists: bool = ...,
        overwrite_source: bool = ...,
    ) -> str: ...

    def save(
        self,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        *,
        skip_existing: bool | None = ...,
    ) -> str: ...

    def view(
        self,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        cleanup: bool = ...,
        quiet: bool = ...,
        quiet_view: bool = ...,
    ) -> str: ...

    def unflatten(
        self,
        stagger: int | None = ...,
        fanout: bool = ...,
        chain: int | None = ...,
    ) -> "Source": ...

    def __iter__(self) -> Iterable[str]: ...


class Digraph(Graph):
    pass


class Source:
    def __init__(
        self,
        source: str,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        format: str | None = ...,
        engine: str | None = ...,
        encoding: str | None = "utf-8",
        *,
        renderer: str | None = ...,
        formatter: str | None = ...,
        loaded_from_path: PathLike | None = ...,
    ) -> None: ...

    @property
    def source(self) -> str: ...

    @property
    def filepath(self) -> str: ...

    def copy(self) -> "Source": ...

    @classmethod
    def from_file(
        cls,
        filename: PathLike,
        directory: PathLike | None = ...,
        format: str | None = ...,
        engine: str | None = ...,
        encoding: str | None = "utf-8",
        renderer: str | None = ...,
        formatter: str | None = ...,
    ) -> "Source": ...

    def pipe(
        self,
        format: str | None = ...,
        renderer: str | None = ...,
        formatter: str | None = ...,
        neato_no_op: bool | int | None = ...,
        quiet: bool = ...,
        *,
        engine: str | None = ...,
        encoding: str | None = ...,
    ) -> bytes | str: ...

    def render(
        self,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        view: bool = ...,
        cleanup: bool = ...,
        format: str | None = ...,
        renderer: str | None = ...,
        formatter: str | None = ...,
        neato_no_op: bool | int | None = ...,
        quiet: bool = ...,
        quiet_view: bool = ...,
        *,
        outfile: PathLike | None = ...,
        engine: str | None = ...,
        raise_if_result_exists: bool = ...,
        overwrite_source: bool = ...,
    ) -> str: ...

    def save(
        self,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        *,
        skip_existing: bool | None = ...,
    ) -> str: ...

    def view(
        self,
        filename: PathLike | None = ...,
        directory: PathLike | None = ...,
        cleanup: bool = ...,
        quiet: bool = ...,
        quiet_view: bool = ...,
    ) -> str: ...

    def unflatten(
        self,
        stagger: int | None = ...,
        fanout: bool = ...,
        chain: int | None = ...,
    ) -> "Source": ...


class ExecutableNotFound(RuntimeError):
    pass


class CalledProcessError(Exception):
    pass


class RequiredArgumentError(ValueError):
    pass


class DotSyntaxWarning(UserWarning):
    pass


class FileExistsError(OSError):
    pass


class FormatSuffixMismatchWarning(UserWarning):
    pass


class UnknownSuffixWarning(UserWarning):
    pass


ENGINES: set[str]
FORMATS: set[str]
FORMATTERS: set[str]
RENDERERS: set[str]
SUPPORTED_JUPYTER_FORMATS: set[str]
DOT_BINARY: PathLike
UNFLATTEN_BINARY: PathLike


def escape(s: str) -> str: ...

def nohtml(s: str) -> str: ...

def render(
    engine: str,
    format: str,
    filepath: str,
    *,
    renderer: str | None = ...,
    formatter: str | None = ...,
) -> str: ...

def pipe(
    engine: str,
    format: str,
    data: bytes,
    *,
    renderer: str | None = ...,
    formatter: str | None = ...,
) -> bytes: ...

def pipe_string(
    engine: str,
    format: str,
    data: str,
    *,
    renderer: str | None = ...,
    formatter: str | None = ...,
) -> str: ...

def pipe_lines(
    engine: str,
    format: str,
    input_lines: Iterator[str],
    *,
    input_encoding: str,
    renderer: str | None = ...,
    formatter: str | None = ...,
    neato_no_op: bool | int | None = ...,
    quiet: bool = ...,
) -> bytes: ...

def pipe_lines_string(
    engine: str,
    format: str,
    input_lines: Iterator[str],
    *,
    encoding: str,
    renderer: str | None = ...,
    formatter: str | None = ...,
    neato_no_op: bool | int | None = ...,
    quiet: bool = ...,
) -> str: ...

def unflatten(
    filepath: str,
    *,
    stagger: int | None = ...,
    fanout: bool = ...,
    chain: int | None = ...,
) -> str: ...

def view(
    filepath: PathLike,
    *,
    quiet: bool = ...,
    quiet_view: bool = ...,
) -> str: ...

def set_default_engine(engine: str) -> str: ...

def set_default_format(format: str) -> str: ...

def set_jupyter_format(jupyter_format: str) -> str: ...

def version() -> tuple[int, ...]: ...