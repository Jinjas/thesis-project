#!/opt/homebrew/bin/python3.11
#by: Alvaro Neto

#input: .ontodl file
#output: .svg file 

import sys
import os
import graphviz
from lark import Lark, Transformer
from matplotlib.pylab import randint

class DotTranslator(Transformer):
    def __init__(self):
        self.ontology = ''
        self.concepts = []
        self.individuals = []
        self.relations = []
        self.triples = []

    def string(self, children):
        (s,) = children
        return s[1:-1]

    def number(self, children):
        (n,) = children
        return float(n)

    def start(self, children):
        self.ontology = children[1]

    def concept_decl(self, children):
        concept = f'\"{children[0]}\" [shape=ellipse, style=filled, color=turquoise4];'
        self.concepts.append(concept)

    def individual_decl(self, children):
        individual = f'\"{children[0]}\" [shape=rectangle, style=filled, color=goldenrod];'
        self.individuals.append(individual)

    def relation_decl(self, children):
        (relation,) = children
        self.relations.append(relation)

    def src(self, children):
        (s,) = children
        return s

    def rel(self, children):
        (r,) = children
        return r

    def dst(self, children):
        (d,) = children
        return d

    def triple_decl(self, children):
        edge_properties = ''
        if children[1] == 'iof': edge_properties = ', style=dashed'
        triple = f'"{children[0]}"->"{children[2]}" [label="{children[1]}"{edge_properties}];'
        self.triples.append(triple)

    def dot(self):
        result = f'digraph {self.ontology} {{'
        for concept in self.concepts:
            result += concept
        for individual in self.individuals:
            result += individual
        for triple in self.triples:
            result += triple
        result += "}"
        return result

def generate_svg(onto_text: str, path: str) -> str:
    #debugging
    #with open("myfile.ontodl"+str(randint(0, 10)), "w") as f:
    #    f.write(onto_text)
    grammar_path = None
    
    candidate = os.path.join(path, 'ontodl.lark')
    if os.path.isfile(candidate):
        grammar_path = candidate
    
    if not grammar_path and os.path.isfile('ontodl.lark'):
        grammar_path = 'ontodl.lark'
    
    if not grammar_path:
        raise FileNotFoundError(f"Cannot find ontodl.lark in {path} or current directory")
    
    with open(grammar_path) as grammar_file:
        parser = Lark(grammar_file.read())
 
        tree = parser.parse(onto_text)
        translator = DotTranslator()
        translator.transform(tree)
        dot_source = graphviz.Source(translator.dot())
        
        svg_output = dot_source.pipe(format='svg', encoding='utf-8')
        return svg_output

if __name__ == '__main__':
    with open('ontodl.lark') as grammar_file:
        parser = Lark(grammar_file.read())
        with open(sys.argv[1]) as source_file:
            tree = parser.parse(source_file.read())
            translator = DotTranslator()
            translator.transform(tree)
            dot_source = graphviz.Source(translator.dot())
            dot_source.render('result',format='svg', cleanup=True)
