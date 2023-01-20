import moment from "moment";
import classes from './CommentStyle.module.css';

// component for comment 
function Comment(props) {

    // Turn comment date into "timeago" format
    const date = moment(props.datePosted).fromNow();

    return (
        <div className={classes.commentWrapper}>
            <div className={classes.commentInfo}>
                {/* <img src={img} alt="userImg" className={classes.commentImg}/> */}
                <span className={classes.commentAuthor}>{props.author}</span>
                <span className={classes.postDate}>{date}</span>
            </div>
            <span className={classes.commentText}>{props.text}</span>
        </div>
    )
}

export default Comment;