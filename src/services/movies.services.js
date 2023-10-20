const db = require("../database/models");
const createError = require("http-errors");

const getAllMovies = async (limit, offset) => {
  try {
    const movies = await db.Movie.findAll({
      limit,
      offset,
      attributes: {
        exclude: ["created_at", "updated_at", "genre_id"],
      },
      include: [
        {
          association: "genre",
          attributes: ["id", "name"],
        },
        {
          association: "actors",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });

    const total = await db.Movie.count();

    return {
      movies,
      total,
    };
  } catch (error) {
    console.log(error);
    throw {
      status: 500,
      message: error.message,
    };
  }
};

const getMovieById = async (id) => {
  try {

    if (!id) throw createError(404, "ID inexistente");

    const movie = await db.Movie.findByPk(id, {
      attributes: {
        exclude: ["created_at", "updated_at", "genre_id"],
      },
      include: [
        {
          association: "genre",
          attributes: ["id", "name"],
        },
        {
          association: "actors",
          attributes: ["id", "first_name", "last_name"],
          through: {
            attributes : []
          }
        },
      ],
    });

    if (!movie) throw createError(400, "No existe pelicula con ese ID");

    return movie;

  } catch (error) {
    console.log(error);
    throw {
      status: error.status || 500,
      message: error.message || "Hubo un error :C",
    };
  }
};

const createMovie = async (dataMovie, actors) => {
  try {
    
    const newMovie = await db.Movie.create(dataMovie);

    if (actors) {
      const actorsDB = actors.map((actor) => {
        return {
          movie_id: newMovie.id,
          actor_id: actor,
        };
      });
      await db.Actor_Movie.bulkCreate(actorsDB, {
        validate: true,
      });
    }

    return newMovie;

  } catch (error) {
    console.log(error);
    throw {
      status: error.status || 500,
      message: error.message || "hubo un error :C",
    };
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
};
