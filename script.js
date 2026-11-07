'use strict';

// mis datos de inventario con nombres genéricos de música
let inventario = [
  { id: 1, nombre: 'Guitarra acústica', categoria: 'Cuerdas', cantidad: 4, precio: 250.00, agotado: false },
  { id: 2, nombre: 'Guitarra eléctrica', categoria: 'Cuerdas', cantidad: 2, precio: 320.00, agotado: false },
  { id: 3, nombre: 'Ukulele', categoria: 'Cuerdas', cantidad: 7, precio: 45.50, agotado: false },
  { id: 4, nombre: 'Batería acústica', categoria: 'Percusión', cantidad: 1, precio: 650.00, agotado: true },
  { id: 5, nombre: 'Batería digital', categoria: 'Percusión', cantidad: 3, precio: 450.00, agotado: false },
  { id: 6, nombre: 'Piano digital', categoria: 'Teclados', cantidad: 0, precio: 850.00, agotado: true },
  { id: 7, nombre: 'Micrófono', categoria: 'Audio', cantidad: 5, precio: 99.99, agotado: false },
  { id: 8, nombre: 'Cables', categoria: 'Audio', cantidad: 15, precio: 18.50, agotado: false }
];

// función con closure para generar IDs únicos a partir de 100
function crearGeneradorId() {
  let contador = 100;
  return function() {
    contador++;
    return contador;
  };
}

const generarId = crearGeneradorId();

// calcula el valor total multiplicando cantidad por precio con un bucle for
function calcularValorTotal(items) {
  let suma = 0;
  for (let i = 0; i < items.length; i++) {
    suma = suma + (items[i].cantidad * items[i].precio);
  }
  return suma;
}

// cuenta las unidades totales con un bucle for
function contarUnidades(items) {
  let totalUnidades = 0;
  for (let i = 0; i < items.length; i++) {
    totalUnidades = totalUnidades + items[i].cantidad;
  }
  return totalUnidades;
}

// cuenta cuántos productos hay por categoría usando un bucle
function contarPorCategoria(items) {
  const conteo = {};
  for (let i = 0; i < items.length; i++) {
    const cat = items[i].categoria;
    if (conteo[cat]) {
      conteo[cat]++;
    } else {
      conteo[cat] = 1;
    }
  }
  return conteo;
}

// crea una celda de tabla (td)
function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
}

// crea una fila completa (tr) con sus celdas y botones con data-id
function crearFila(item) {
  const fila = document.createElement('tr');
  const subtotal = item.cantidad * item.precio;

  fila.appendChild(crearCelda(item.nombre));
  fila.appendChild(crearCelda(item.categoria));
  fila.appendChild(crearCelda(item.cantidad));
  fila.appendChild(crearCelda('$' + item.precio.toFixed(2)));
  fila.appendChild(crearCelda('$' + subtotal.toFixed(2)));

  // celda para mostrar si está agotado o disponible
  const celdaEstado = document.createElement('td');
  if (item.agotado) {
    celdaEstado.textContent = 'Agotado';
    celdaEstado.className = 'agotado';
  } else {
    celdaEstado.textContent = 'Disponible';
    celdaEstado.className = 'disponible';
  }
  fila.appendChild(celdaEstado);

  // celda con los botones de acción
  const celdaAcciones = document.createElement('td');
  
  const btnEstado = document.createElement('button');
  btnEstado.textContent = 'Cambiar Estado';
  btnEstado.className = 'btn-estado';
  btnEstado.setAttribute('data-id', item.id);
  
  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = 'Eliminar';
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.setAttribute('data-id', item.id);
  
  celdaAcciones.appendChild(btnEstado);
  celdaAcciones.appendChild(btnEliminar);
  fila.appendChild(celdaAcciones);

  return fila;
}

// dibuja los elementos en el tbody y actualiza los indicadores de la pantalla
function renderizar(items) {
  const cuerpo = document.getElementById('cuerpo-inventario');
  cuerpo.innerHTML = ''; // limpiamos antes de pintar

  for (let i = 0; i < items.length; i++) {
    cuerpo.appendChild(crearFila(items[i]));
  }

  // actualizamos los indicadores visuales
  document.getElementById('total-productos').textContent = items.length;
  document.getElementById('total-unidades').textContent = contarUnidades(items);
  document.getElementById('valor-total').textContent = calcularValorTotal(items).toFixed(2);

  // contar cuántos están agotados en la vista actual
  let agotadosCount = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      agotadosCount++;
    }
  }
  document.getElementById('total-agotados').textContent = agotadosCount;

  // mostrar u ocultar mensaje de vacío si no hay resultados
  const mensajeVacio = document.getElementById('mensaje-vacio');
  if (items.length === 0) {
    mensajeVacio.style.display = 'block';
  } else {
    mensajeVacio.style.display = 'none';
  }
}

// filtra por categoría sin modificar el array original
function filtrarPorCategoria(categoriaSeleccionada) {
  if (categoriaSeleccionada === 'todas') {
    return inventario;
  }
  const filtrados = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].categoria === categoriaSeleccionada) {
      filtrados.push(inventario[i]);
    }
  }
  return filtrados;
}

// valida los campos del formulario y lanza un error si algo está mal
function validarProducto(datos) {
  if (datos.nombre.trim() === '') {
    throw new Error('El nombre no puede estar vacío.');
  }
  if (datos.categoria.trim() === '') {
    throw new Error('La categoría no puede estar vacía.');
  }
  const cantNum = Number(datos.cantidad);
  if (isNaN(cantNum) || cantNum <= 0 || !Number.isInteger(cantNum)) {
    throw new Error('La cantidad debe ser un número entero mayor que cero.');
  }
  const precioNum = Number(datos.precio);
  if (isNaN(precioNum) || precioNum < 0) {
    throw new Error('El precio debe ser un número mayor o igual a cero.');
  }
}

// maneja el envío del formulario con try...catch
function agregarProducto(event) {
  event.preventDefault();
  const errorDiv = document.getElementById('mensaje-error');
  errorDiv.textContent = '';

  try {
    const nombreInput = document.getElementById('nombre').value;
    const categoriaInput = document.getElementById('categoria').value;
    const cantidadInput = document.getElementById('cantidad').value;
    const precioInput = document.getElementById('precio').value;

    const datosNuevos = {
      nombre: nombreInput,
      categoria: categoriaInput,
      cantidad: cantidadInput,
      precio: precioInput
    };

    validarProducto(datosNuevos);

    const nuevoItem = {
      id: generarId(),
      nombre: nombreInput.trim(),
      categoria: categoriaInput.trim(),
      cantidad: parseInt(cantidadInput),
      precio: parseFloat(precioInput),
      agotado: false
    };

    inventario.push(nuevoItem);

    // actualizar la vista manteniendo el filtro actual
    const categoriaActual = document.getElementById('filtro-categoria').value;
    renderizar(filtrarPorCategoria(categoriaActual));
    actualizarOpcionesFiltro();

    // limpiar el formulario
    document.getElementById('formulario-producto').reset();
    console.log('Alta exitosa de producto:', nuevoItem);

  } catch (error) {
    errorDiv.textContent = error.message;
    console.error('Error al agregar producto:', error.message);
  }
}

// elimina un producto y devuelve un nuevo array con un bucle
function eliminarProducto(idBuscado) {
  const nuevoInventario = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== idBuscado) {
      nuevoInventario.push(inventario[i]);
    }
  }
  return nuevoInventario;
}

// cambia el estado de agotado a disponible o viceversa
function cambiarEstado(idBuscado) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === idBuscado) {
      inventario[i].agotado = !inventario[i].agotado;
      console.log('Cambio de estado en producto ID:', idBuscado, 'Agotado:', inventario[i].agotado);
    }
  }
}

// llena el select de categorías dinámicamente según los datos
function actualizarOpcionesFiltro() {
  const selectFiltro = document.getElementById('filtro-categoria');
  const valorAnterior = selectFiltro.value;
  
  selectFiltro.innerHTML = '<option value="todas">Todas</option>';

  const categoriasUnicas = [];
  for (let i = 0; i < inventario.length; i++) {
    const cat = inventario[i].categoria;
    let encontrada = false;
    for (let j = 0; j < categoriasUnicas.length; j++) {
      if (categoriasUnicas[j] === cat) {
        encontrada = true;
      }
    }
    if (!encontrada) {
      categoriasUnicas.push(cat);
    }
  }

  for (let i = 0; i < categoriasUnicas.length; i++) {
    const option = document.createElement('option');
    option.value = categoriasUnicas[i];
    option.textContent = categoriasUnicas[i];
    selectFiltro.appendChild(option);
  }

  selectFiltro.value = valorAnterior;
}

// --- FLUJO PRINCIPAL AL CARGAR LA PÁGINA ---

// 1 y 2. renderizar inventario completo al iniciar
renderizar(inventario);

// 3. llenar el selector de categorías
actualizarOpcionesFiltro();

// 4. escuchar el submit del formulario
document.getElementById('formulario-producto').addEventListener('submit', agregarProducto);

// 5. delegación de eventos en el tbody para eliminar o cambiar estado
const cuerpoTabla = document.getElementById('cuerpo-inventario');
cuerpoTabla.addEventListener('click', function(event) {
  const elemento = event.target;
  const idStr = elemento.getAttribute('data-id');

  if (!idStr) return; // si no tiene data-id, ignoramos
  const idNum = parseInt(idStr);

  if (elemento.classList.contains('btn-estado')) {
    cambiarEstado(idNum);
    const categoriaActual = document.getElementById('filtro-categoria').value;
    renderizar(filtrarPorCategoria(categoriaActual));
  } else if (elemento.classList.contains('btn-eliminar')) {
    inventario = eliminarProducto(idNum);
    console.log('Baja del producto con ID:', idNum);
    actualizarOpcionesFiltro();
    const categoriaActual = document.getElementById('filtro-categoria').value;
    renderizar(filtrarPorCategoria(categoriaActual));
  }
});

// 6. escuchar cambios en el selector para filtrar
document.getElementById('filtro-categoria').addEventListener('change', function(event) {
  const categoriaSeleccionada = event.target.value;
  const resultados = filtrarPorCategoria(categoriaSeleccionada);
  renderizar(resultados);
});

// 7 y 8. salidas requeridas en la consola
console.table(inventario);
console.table(contarPorCategoria(inventario));