PANDO = pandoc
# FLAGS = --top-level-division=chapter --listings -r markdown-auto_identifiers -w latex -o
FLAGS = --top-level-division=chapter --listings -o

all:
	$(PANDO) 0*.md -o Tema05.pdf --template docs/eisvogel --listings --number-sections

clean:
	rm *aux