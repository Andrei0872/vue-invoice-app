<script>
import VButton from './VButton';

export default {
    functional: true,

    components: { VButton },

    props: {
        // Responsible for undo / redo feature
        historyStore: Object,
        mainStore: Object,
        currentEntity: String,
        callbacks: Object
    },

    render (h, context) {
        const { historyStore, mainStore, currentEntity, callbacks } = context.props;

        Object.assign(historyStore.state, { mainStore, currentEntity, callbacks });

        const shouldDisplayUndo = historyStore.state.undoStack.length !== 0;
        const shouldDisplayRedo = historyStore.state.redoStack.length !== 0;

        return (
            <div style={{  display: 'inline-block' }}>
                {
                    shouldDisplayUndo 
                        ? <VButton 
                                onClick={historyStore.dispatch.bind(null,'undo')}
                                btnClass={'FABtn'} 
                            >
                                <font-awesome-icon icon={'undo'}/>
                            </VButton>
                        : null
                }
                {
                    shouldDisplayRedo
                    ? <VButton 
                            onClick={historyStore.dispatch.bind(null,'redo')} 
                            btnClass={'FABtn'}
                        >
                            <font-awesome-icon icon={'redo'}/>
                        </VButton>
                    : null
                }
            </div>
        )
    }   
}
</script>