import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { Rating, TextField } from '@mui/material';
import { db } from '@/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useSession } from 'next-auth/react';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    borderRadius: 2,
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

export default function FeedbackButton({ setReviews }) {

    const { data: session, status } = useSession()
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setFeedback('');
        setRating(0);
        setOpen(false)
    };
    const [feedback, setFeedback] = React.useState('');
    const [rating, setRating] = React.useState(0);

    const handleSubmit = async () => {
        // Handle the feedback submission here (e.g., send it to an API)
        try {
            await addDoc(collection(db, "reviews"), {
                name: session?.user?.name,
                text: feedback,
                rating,
                image: session?.user?.image,
            });
            setReviews(reviews => [...reviews, { name: session?.user?.name, text: feedback, rating, image: session?.user?.image }])
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        setFeedback(''); // Clear the text field after submission
        setRating(0); // Reset the rating
        handleClose(); // Close the modal
    };

    return (
        <>
            <Button
                sx={{
                    marginTop: '20px',
                }}
                onClick={handleOpen}
                variant='contained'
            >
                <ReviewsIcon sx={{ marginRight: '10px' }} />
                Got Feedback?
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="feedback-modal-title" variant="h6" component="h2">
                        Submit Your Feedback
                    </Typography>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(_, newValue) => {
                            setRating(newValue);
                        }}
                        sx={{ mt: 2, mb: 2 }}
                    />
                    <TextField
                        id="feedback-modal-description"
                        label="Your Feedback"
                        multiline
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleSubmit} fullWidth>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </>
    );
}