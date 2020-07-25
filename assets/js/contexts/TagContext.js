import React, {createContext} from 'react';
import axios from 'axios';

export const TagContext = createContext();

class TagContextProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:      null,
            isLoading: false,
            message:   {
                text:  null,
                level: null,
            },

            read:         this.read.bind(this),
            create:       this.create.bind(this),
            delete:       this.delete.bind(this),
            update:       this.update.bind(this),
            handleChange: this.handleChange.bind(this),
            resetTag:     this.resetTag.bind(this),
        };
    }

    handleChange(oldTag, e) {
        const tags = [...this.state.tags];

        let tag = tags.find(tag => tag.id === oldTag.id);

        tag.name = e.target.value;

        this.setState({
            ...this.state,
            tags: tags,
        });
    }

    resetTag(oldTag) {
        console.log(oldTag);

        const tags = [...this.state.tags];

        let tag = tags.find(tag => tag.id === oldTag.id);

        tag.name = oldTag.name;

        this.setState({
            ...this.state,
            tags: tags,
        });
    }


    //create
    /**
     * @param data {object}
     * @param data.name {string}
     */
    async create(data) {
        this.setState({isLoading: true});
        try {
            const r = await axios.post('/api/tag/create', data);
            const createdTag = r.data.tag, message = r.data.message;

            if (message !== undefined && message.level === 'error') {
                this.setState({
                    message:   message,
                    isLoading: false,
                });
            } else {
                this.setState({
                    tags:      [...this.state.tags, createdTag],
                    isLoading: false,
                });
            }
        } catch (e) {
            console.error(e);
            this.setState({
                errors:    e,
                isLoading: false,
            });
        }

    }

    //read
    async read() {
        if (this.state.isLoading) return;

        this.setState({isLoading: true});

        try {
            const r = await axios.get('/api/tag/read');
            this.setState({
                tags:      r.data,
                isLoading: false,
            });
        } catch (e) {
            this.setState({
                errors:    e,
                isLoading: false,
            });
        }
    };

    /**
     *
     * @param data
     * @returns {Promise<void>}
     */
    async update(data) {
        try {
            const tags = [...this.state.tags];
            let tag = tags.find(tag => tag.id === data.id);

            if (tag.name !== data.name) {
                if (this.state.isLoading) return;
                this.setState({isLoading: true});
                const r = await axios.put('/api/tag/update/' + tag.id, tag);
                this.setState({isLoading: false});
            }

        } catch (e) {
            this.setState({
                error:     e,
                isLoading: false,
            });
        }
    }

    /**
     * delete
     * @param data {object}
     * @param data.id {number}
     * @param data.name {string}
     */
    async delete(data) {
        try {
            if (this.state.isLoading) return;

            this.setState({isLoading: true});
            const r = await axios.delete('/api/tag/delete/' + data.id);
            const newTags = [...this.state.tags].filter(tag => tag.id !== data.id);

            this.setState({
                tags:      newTags,
                isLoading: false,
            });

        } catch (e) {
            this.setState({
                error:     e,
                isLoading: false,
            });
        }
    }

    render() {
        return (
            <TagContext.Provider value={{
                ...this.state,
            }}>
                {this.props.children}
            </TagContext.Provider>
        );
    }
}

export default TagContextProvider;