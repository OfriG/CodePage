const CodeBlock= require('../models/codeBlock');

const getAllBlocks = async(req,res)=>{
    const blocks= await CodeBlock.find();
    res.json(blocks);
};

const getBlock = async (req,res)=>{
    const block = await CodeBlock.findById(req.params.id);
    if (!block) {
        return res.status(404).json({ message: 'Block not found' });
      }
    res.json(block);
}


module.exports={
    getAllBlocks, getBlock
}