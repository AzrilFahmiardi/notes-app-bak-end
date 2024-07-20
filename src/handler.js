const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSucces = notes.filter((note) => note.id === id).length > 0;

  if (isSucces) {
    const response = h.response({
      status: "succes",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal dikirim",
  });
  response.code(500);
  return response;
};

const getAllNoteHandler = () => ({
  status: "succes",
  data: {
    notes,
  },
});

const getNotebyIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: "succes",
      data: {
        note,
      },
    };
  }

  const respone = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });

  respone.code(404);
  return respone;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const respone = h.response({
      status: "succes",
      message: "Catatan berhasil diperbarui",
    });

    respone.code(200);
    return respone;
  }
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const respone = h.response({
      status: "succes",
      message: "Catatan berhasil dihapus",
    });

    respone.code(200);
    return respone;
  }

  const respone = h.response({
    status: "fail",
    message: "Catatan gagal dihapus, Id tidak ditemukan",
  });
  respone.code(404);
  return respone;
};

module.exports = { addNoteHandler, getAllNoteHandler, getNotebyIdHandler, editNoteByIdHandler, deleteNoteByIdHandler };
