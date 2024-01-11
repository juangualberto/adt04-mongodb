PANDO = pandoc
# FLAGS = --top-level-division=chapter --listings -r markdown-auto_identifiers -w latex -o
FLAGS = --top-level-division=chapter --listings -o

all:
	$(PANDO) docs/0*.md -o Tema04.pdf --template docs/eisvogel --listings --number-sections

clean:
	rm *aux