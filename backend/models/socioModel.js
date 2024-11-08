const sql = require('mssql');
const { poolPromise } = require('../config/db');

const socioModel = {
    buscarSocio: async (campo, datoConsulta) => {
        try {
            let respuesta;
            const pool = await poolPromise;

            // Revisa qué campo está siendo utilizado para la búsqueda.
            if (campo === 'cedula') {
                // Buscar por cédula
                respuesta = await pool.request()
                    .input('cedula', sql.VarChar, datoConsulta)
                    .query('SELECT * FROM socios WHERE cedula = @cedula');
                return respuesta.recordset[0];

            } else if (campo === 'num_tarjeta') {
                // Buscar por número de tarjeta
                respuesta = await pool.request()
                    .input('num_tarjeta', sql.VarChar, datoConsulta)
                    .query('SELECT * FROM socios WHERE num_tarjeta = @num_tarjeta');
                return respuesta.recordset[0];

            } else if (campo === 'faf') {
                // Buscar por FAF
                respuesta = await pool.request()
                    .input('num_poliza', sql.VarChar,`%${datoConsulta}`)
                    .query('SELECT * FROM socios WHERE num_poliza LIKE @num_poliza');
                return respuesta.recordset[0];

            } else if (campo === 'nombres') {
                // Buscar por nombres (utilizando LIKE para permitir coincidencias parciales)
                respuesta = await pool.request()
                    .input('nombres', sql.VarChar, `%${datoConsulta}%`) // Agregar '%' para buscar coincidencias parciales
                    .query('SELECT * FROM socios WHERE nombres LIKE @nombres');
                return respuesta.recordset[0];
            }

            // Si no se encontró el socio con los datos proporcionados
            return null;

        } catch (error) {
            console.error('Error en el modelo al obtener el socio:', error);
            throw error;
        }
    },

    registrarSocio: async (datos) => {
        const { id_socio, invitados } = datos;

        try {  
            const pool = await poolPromise;
            const respuesta = await pool.request()
                .input('id_socio', sql.Int, id_socio)
                .input('invitados', sql.Int, invitados)
                .query(`INSERT INTO Registros (id_socio, fecha_hora, invitados) VALUES 
                    (@id_socio, GETDATE() , @invitados)`);
            return respuesta;
        } catch (error) {
            console.log('Error en el modelo al registrar socio:', error);
        }
    }
}

module.exports = socioModel;
