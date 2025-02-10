import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CodeTypingEffect = () => {
  const [text, setText] = useState('');
  const codeSnippet = `function Developer() {
  const skills = ['React', 'Node.js', 'Python'];
  const passion = 'Building amazing apps';
  
  return {
    code: () => transform(ideas, skills),
    learn: () => skills.push(newTech),
    grow: () => never.stop.learning()
  };
}`;

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setText(codeSnippet.slice(0, currentIndex));
      currentIndex++;
      
      if (currentIndex > codeSnippet.length) {
        currentIndex = 0;
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 2,
        p: 2,
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#00ff00',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}
      >
        {text}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{ color: '#00ff00' }}
        >
          |
        </motion.span>
      </Typography>
    </Box>
  );
};

export default CodeTypingEffect;
