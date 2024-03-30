import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Container = () => {
    const name = "Sai Pavan Velidandla";
    const [msg, setMsg] = useState('');
    const [blocks, setBlocks] = useState([]);
    const [activeItem, setActiveItem] = useState('# Sales Team');


    useEffect(() => {
        fetchMessages(); // Fetch messages when the component mounts
    }, []); // Empty dependency array ensures the effect runs only once after mounting

    
    const fetchMessages = () => {
        axios.get('http://localhost:3001/messages')
            .then(response => {
                console.log(response.data)
                setBlocks(response.data);
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
    };

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };

    const update = (e) => {
        setMsg(e.target.value);
    }

const send = () => {
    if (msg.trim() !== '') {
        axios.post('http://localhost:3001/send-message', { message: msg })
            .then(response => {
                console.log(response.data);
                const newBlock = { name: name, msg: msg };
                setBlocks(prevBlocks => [...prevBlocks, newBlock]); // Update blocks state with the new message
                setMsg('');
                document.querySelector("#msg").focus();
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    }
};


    return (
        <div className='container-ch'>
            <div id="main-ch">
                <div id="sidebar-ch">
                    <menu>
                        <li className={activeItem === '# Sales Team' ? 'active' : ''} onClick={() => handleItemClick('# Sales Team')}># Sales Team</li>
                        <li className={activeItem === '# Marketing Team' ? 'active' : ''} onClick={() => handleItemClick('# Marketing Team')}># Marketing Team</li>
                        <li className={activeItem === '# Development Team' ? 'active' : ''} onClick={() => handleItemClick('# Development Team')}># Development Team</li>
                        <li className={activeItem === '# Testing Team' ? 'active' : ''} onClick={() => handleItemClick('# Testing Team')}># Testing Team</li>
                        <li className={activeItem === '# Product Team' ? 'active' : ''} onClick={() => handleItemClick('# Product Team')}># Product Team</li>
                    </menu>
                    <Link to="/logout" id="lo-ch"># Logout</Link>
                </div>
                <div id="content-ch">
                    <div id="blocks-ch">
                        {blocks.map((block, index) => (
                            <div className={index % 2 === 0 ? "block left" : "block right"} key={index}>
                                <h4>{block._id}</h4>
                                <p>{block.message}</p>
                            </div>
                        ))}
                    </div>
                    <div id="msgbox-ch">
                        <input type="text" id="msg" value={msg} placeholder="Type your message" onChange={update} />
                        <button onClick={send}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Container;
