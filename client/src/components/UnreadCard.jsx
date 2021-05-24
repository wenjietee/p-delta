import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';
const useStyles = makeStyles({
	root: {
		minWidth: 200,
		maxWidth: 300,
		width: '100%',
		marginTop: 30,
	},
	listItem: {
		textDecoration: 'none',
		color: '#268ede',
	},
});

const UnreadCard = (props) => {
	const classes = useStyles();
	return (
		<Card raised className={classes.root}>
			<List
				component='nav'
				className={classes.root}
				aria-label='mailbox folders'
			>
				<ListItem>
					<ListItemText
						primary={`Unread Articles (${props.unreads.user_unreads.length})`}
					/>
				</ListItem>

				<Divider />
				{props.unreads.user_unreads.map((unread) => {
					return (
						<ListItem button divider key={unread.id}>
							<Link
								to={`/article/${unread.article.id}`}
								className={classes.listItem}
							>
								<ListItemText primary={unread.article.title} />
							</Link>
						</ListItem>
					);
				})}
			</List>
		</Card>
	);
};

export default UnreadCard;
