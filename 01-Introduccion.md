# Bases de datos documentales

Las bases de datos documentales son un tipo de sistema de gestión de bases de datos (SGBD) que se centra en el almacenamiento y recuperación de datos en formato de documentos. En lugar de organizar la información en tablas como en las bases de datos relacionales, las bases de datos documentales utilizan documentos, que pueden ser en formatos como JSON (JavaScript Object Notation) o BSON (Binary JSON). Cada documento puede contener datos estructurados y no estructurados, lo que proporciona flexibilidad en la representación de la información.

Mientras que las bases de datos relacionales están más recomendadas a casos en los que hay mucha rotación de datos, las documentales se recomiendan para los casos donde hay pocas o nulas actualizaciones.

Características comunes de las bases de datos documentales:

1. **Documentos:** La unidad básica de almacenamiento es el documento, que puede contener datos en formato clave-valor, matrices, objetos anidados, etc.

2. **Esquema dinámico:** A diferencia de las bases de datos relacionales, las bases de datos documentales permiten esquemas dinámicos, lo que significa que cada documento en la colección puede tener diferentes campos.

3. **Flexibilidad:** Son adecuadas para datos semiestructurados y no estructurados, lo que facilita el almacenamiento de información variada y cambiante.

4. **Escalabilidad horizontal:** Muchas bases de datos documentales están diseñadas para escalar horizontalmente, distribuyendo la carga de trabajo en varios servidores para manejar grandes volúmenes de datos y tráfico.

5. **Consultas eficientes:** Permiten realizar consultas eficientes utilizando índices en los campos clave.

Ejemplos de bases de datos documentales:

1. **MongoDB:** Es una de las bases de datos documentales más populares y ampliamente utilizadas. Almacena datos en formato BSON (una representación binaria de JSON) y permite esquemas flexibles.

2. **Firebase Firestore:** Es una base de datos documental en la nube proporcionada por Firebase, que es parte de Google Cloud Platform. Almacena datos en formato JSON y es especialmente popular para aplicaciones web y móviles.

\pagebreak

