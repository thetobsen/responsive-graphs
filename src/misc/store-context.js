import React, { createContext, useState } from 'react';

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
	const [articles, setArticles] = useState([]);
	const [comments, setComments] = useState({ data: null, _bibId: '' });
	const [user, setUser] = useState(null);
	const [commentWriteToken, setCommentWriteToken] = useState(null);

	const storeValue = {
		articles,
		setArticles,

		comments,
		setComments,

		user,
		setUser,

		commentWriteToken,
		setCommentWriteToken,
	};	

	return (
		<StoreContext.Provider value={storeValue}>
			{ children }
		</StoreContext.Provider>
	);	
};

export default StoreContext;
export { StoreProvider };