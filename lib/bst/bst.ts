
class node
{
    #left: node | null
    #right: node | null
    #key: number
    #value: any

    constructor(key: number, value: any, left: node | null = null, 
                                         right: node | null = null)
    {
        this.#left = null
        this.#right = null
        this.#key = key
        this.#value = value
    }

    #create(key: number, value: any, left: node | null = null, 
                                     right: node | null = null)
    {
        return new node(key, value, left, right)
    }

    search(key: number): node | null
    {
        const { child } = this.#findNode(key)
        return child
    }

    add(key: number, value: any): boolean
    {
        const { parent, child } = this.#findNode(key)
        if (parent !== null && child === null)
        {
            const lastComparison = key - parent.getKey()
            const nodeNew = this.#create(key, value)
            lastComparison <= 0 ? parent.setLeft(nodeNew) : parent.setRight(nodeNew)
            return true
        }
        return false
    }

    delete(key: number): node
    {
        let newRoot: node = this
        // Find node to remove
        const { parent, child } = this.#findNode(key)
        if (parent === null && child !== null)
        {
            const { successor } = child.#extractSuccessor()   
            console.log(`current: ${successor.getKey()}`)
            if (successor !== null)
            {
                const successorKey = successor.getKey()
                const childLeft = child.getLeft()
                const childRight = child.getRight()
                if (successorKey !== childLeft.getKey())
                {
                    console.log(`left: ${childLeft.getKey()}`)
                    successor.setLeft(childLeft)
                }
                
                if (successorKey !== childRight.getKey())
                {
                    console.log(`right: ${childRight.getKey()}`)
                    successor.setRight(childRight)
                }
            }

            newRoot = successor

            // Delete Child: Implicitily remove child since node tree wont have access to it anymore
        }
        else if (parent !== null && child !== null)
        {
            const { successor } = child.#extractSuccessor()
            if (successor !== null)
            {
                const successorKey = successor.getKey()
                const childLeft = child.getLeft()
                const childRight = child.getRight()
                if (successorKey !== childLeft.getKey())
                {
                    successor.setLeft(child.getLeft())
                }
                
                if (successorKey !== childRight.getKey())
                {
                    successor.setRight(child.getRight())
                }
            }

            if ((child.getKey() - parent.getKey()) <= 0)
            {
                parent.setLeft(successor)
            }
            else
            {
                parent.setRight(successor)
            }

            // Delete Child: Implicitily remove child since node tree wont have access to it anymore
        }
        return newRoot
    }

    inorderTraversal(node: node = this): number[]
    {
        if (node !== null)
        {
            const left: number[] = this.inorderTraversal(node.getLeft())
            const right: number[] = this.inorderTraversal(node.getRight())
            return [ node.getKey(), ...left, ...right ]
        }

        return []
    }

    getKey()
    {
        return this.#key
    }

    getValue()
    {
        return this.#value
    }

    getLeft()
    {
        return this.#left
    }

    getRight()
    {
        return this.#right
    }

    setLeft(node: node)
    {
        this.#left = node
    }

    setRight(node: node)
    {
        this.#right = node
    }

    /**
     * This function tries to find the node matching the key.
     * 
     * NOTE 1: If the parent is null then a duplicate node was found
     * NOTE 2: If the child is null then a leaf node was found
     * NOtE 3: child is the node matching key
     * @param key  Node to find
     * @returns  Data of the last comparison
     */
    #findNode(key: number): { parent: node, child: node }
    {
        // Find parent node of child with correct key
        let parent: node = null
        let current: node = this
        while (current !== null)
        {
            const comparison = key - current.getKey()
            if (comparison === 0)
            {
                break
            }
            else
            {
                parent = current
                current = (comparison < 0) ? current.getLeft() : current.getRight()
            }
        }

        return { parent, child: current }
    }

    #extractSuccessor(): { successor: node }
    {
        let successor: node = this.getRight()
        let successorParent: node = this
        let successorTemporary: node = null
        if (successor !== null)
        {
            // Find smallest number larger then removed node
            successorTemporary = successor.getLeft()
            let flag = true
            while (successorTemporary !== null)
            {
                flag = false
                successorParent = successor
                successor = successorTemporary
                successorTemporary = successorTemporary.getLeft()
            }

            // Successor: Move right child of successor up
            const childOld = successor.getRight()
            if (flag)
            {
                successorParent.setRight(childOld)
            }
            else
            {
                successorParent.setLeft(childOld)
            }
        }
        else 
        {
            // Find largest number smaller then removed node
            successor = this.getLeft()
            if (successor !== null)
            {
                successorTemporary = successor.getRight()
                let flag = true
                while (successorTemporary !== null)
                {
                    flag = false
                    successorParent = successor
                    successor = successorTemporary
                    successorTemporary = successorTemporary.getRight()
                }

                // Successor: Move left child of successor up
                const childOld = successor.getLeft()
                if (flag)
                {
                    successorParent.setLeft(childOld)
                }
                else
                {
                    successorParent.setRight(childOld)
                }
            }
        }

        if (successor !== null)
        {
            successor.setLeft(null)
            successor.setRight(null)
        }

        return { successor }
    }
}

export class bst
{
    #root: node
    constructor(key: number, value: any, left: node | null = null, 
                                         right: node | null = null)
    {
        const newRoot = new node(key, value, left, right)
        this.setRoot(newRoot)
    }

    add(key: number, value: any): boolean
    {
        const root = this.getRoot()
        if (root != null)
        {
            return root.add(key, value)
        }
        return false
    }

    search(key: number): node
    {
        const root = this.getRoot()
        if (root != null)
        {
            return root.search(key)
        }
        return null
    }

    delete(key: number): boolean
    {
        const root = this.getRoot()
        if (root != null)
        {
            const newRoot = root.delete(key)
            this.setRoot(newRoot)
            return true
        }
        return false
    }

    getRoot(): node
    {
        return this.#root
    }

    setRoot(node: node): void
    {
        this.#root = node
    }

    inorderTraversal()
    {
        const root = this.getRoot()
        if (root != null)
        {
           return root.inorderTraversal()
        }
    }
}

// let root: bst = new bst(7, null)
// root.add(2, null)
// root.add(3, null)
// root.add(9, null)
// root.add(8, null)
// root.add(10, null)
// console.log(root.inorderTraversal())
// Delete all
// root = root.delete(10)
// root = root.delete(8)
// root = root.delete(9)
// root = root.delete(3)
// root = root.delete(2)
// Delete root
// root = root.delete(7)
// console.log(root.inorderTraversal())
// root = root.delete(8)
//console.log(root.inorderTraversal())
