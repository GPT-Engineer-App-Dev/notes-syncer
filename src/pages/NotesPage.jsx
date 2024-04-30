import { useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import { client } from 'lib/crud';

const NotesPage = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const fetchedNotes = await client.getWithPrefix('note:');
    setNotes(fetchedNotes.map(n => ({ id: n.key.split(':')[1], content: n.value.note })));
  };

  const addNote = async () => {
    const newNoteId = Date.now().toString();
    await client.set(`note:${newNoteId}`, { note });
    fetchNotes();
    setNote('');
  };

  const updateNote = async (id, updatedContent) => {
    await client.set(`note:${id}`, { note: updatedContent });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await client.delete(`note:${id}`);
    fetchNotes();
  };

  return (
    <Box p={5}>
      <Input placeholder="Write a note" value={note} onChange={(e) => setNote(e.target.value)} />
      <Button onClick={addNote} mt={2}>Add Note</Button>
      {notes.map(n => (
        <Box key={n.id} p={3} mt={2} bg="gray.100">
          <Text>{n.content}</Text>
          <Input defaultValue={n.content} onBlur={(e) => updateNote(n.id, e.target.value)} />
          <Button colorScheme="red" onClick={() => deleteNote(n.id)}>Delete</Button>
        </Box>
      ))}
    </Box>
  );
};

export default NotesPage;