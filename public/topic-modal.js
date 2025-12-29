// Topic Modal Management
let currentTopicId = null;

function openTopicModal(topicId) {
    currentTopicId = topicId;
    const modal = document.getElementById('topicModal');
    
    // Fetch topic data
    fetch(`/api/v1/topics/${topicId}`)
        .then(response => response.json())
        .then(topic => {
            // Update modal content
            document.getElementById('topicTitle').textContent = topic.name || 'Tópico sem título';
            
            const descriptionElement = document.getElementById('topicDescription');
            if (topic.description && topic.description.trim()) {
                descriptionElement.innerHTML = topic.description;
            } else {
                descriptionElement.innerHTML = '<p class="no-description">Nenhuma descrição disponível para este tópico.</p>';
            }
            
            // Update video
            const videoElement = document.getElementById('topicVideo');
            if (topic.videoUrl) {
                const videoId = getYouTubeVideoId(topic.videoUrl);
                videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                videoElement.parentElement.style.display = 'block';
            } else {
                videoElement.src = '';
                videoElement.parentElement.style.display = 'none';
            }
            
            // Update resources
            const resourceList = document.getElementById('resourceList');
            if (topic.resources && topic.resources.length > 0) {
                console.log('📎 Recursos do tópico:', topic.resources);
                resourceList.innerHTML = topic.resources.map(resource => {
                    console.log('📋 Recurso:', resource.title, 'Tipo:', resource.type, 'Ícone:', getResourceIcon(resource.type));
                    return `
                    <div class="resource-item">
                        <a href="${resource.url}" target="_blank" rel="noopener noreferrer">
                            <i class="${getResourceIcon(resource.type)}"></i>
                            <span class="resource-title">${resource.title}</span>
                            <span class="resource-type">${resource.type}</span>
                        </a>
                    </div>
                `;
                }).join('');
            } else {
                resourceList.innerHTML = '<p class="no-resources">Nenhum recurso externo disponível.</p>';
            }
            
            // Update files
            const fileList = document.getElementById('topicFileList');
            console.log('📁 Arquivos do tópico:', topic.files);
            if (topic.files && topic.files.length > 0) {
                fileList.innerHTML = topic.files.map(file => {
                    console.log('📄 Arquivo:', file.name, 'Path:', file.path);
                    return `
                    <div class="file-item">
                        <a href="${file.path}" target="_blank" rel="noopener noreferrer" class="file-link" onclick="console.log('🔗 Clique no arquivo: ${file.name}')">
                            <div class="file-icon">
                                <i class="fas ${getFileIcon(file.type)}"></i>
                            </div>
                            <div class="file-details">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${formatFileSize(file.size)}</div>
                            </div>
                            <div class="file-action">
                                <i class="fas fa-external-link-alt"></i>
                            </div>
                        </a>
                    </div>
                `;
                }).join('');
            } else {
                fileList.innerHTML = '<p class="no-files">Nenhum arquivo disponível.</p>';
            }
            
            // Load personal notes for this topic
            loadPersonalNotes(topicId);
            
            // Show modal
            modal.style.display = 'flex';
        })
        .catch(error => {
            console.error('Error fetching topic data:', error);
            
            // Show error in modal
            document.getElementById('topicTitle').textContent = 'Erro ao carregar tópico';
            document.getElementById('topicDescription').innerHTML = '<p class="error-message">Não foi possível carregar as informações deste tópico. Tente novamente mais tarde.</p>';
            document.getElementById('resourceList').innerHTML = '';
            document.getElementById('fileList').innerHTML = '';
            
            // Show modal anyway
            modal.style.display = 'flex';
        });
}

function closeTopicModal() {
    const modal = document.getElementById('topicModal');
    const video = document.getElementById('topicVideo');
    
    // Stop video playback
    video.src = '';
    
    // Hide modal
    modal.style.display = 'none';
    currentTopicId = null;
}

// Utility functions
function getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getResourceIcon(type) {
    const icons = {
        'link': 'fas fa-external-link-alt',
        'article': 'fas fa-newspaper',
        'documentation': 'fas fa-book-open',
        'github': 'fab fa-github',
        'video': 'fas fa-play-circle'
    };
    return icons[type] || 'fas fa-external-link-alt';
}

function getFileIcon(type) {
    const icons = {
        'pdf': 'fa-file-pdf',
        'doc': 'fa-file-word',
        'docx': 'fa-file-word',
        'txt': 'fa-file-alt',
        'zip': 'fa-file-archive',
        'rar': 'fa-file-archive',
        'jpg': 'fa-file-image',
        'jpeg': 'fa-file-image',
        'png': 'fa-file-image',
        'gif': 'fa-file-image'
    };
    return icons[type] || 'fa-file-alt';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Personal Notes Management
function loadPersonalNotes(topicId) {
    if (!topicId || !currentUser) return;
    
    const notesKey = `topic_notes_${currentUser.id}_${topicId}`;
    const savedNotes = localStorage.getItem(notesKey);
    const notesTextarea = document.getElementById('personalNotes');
    
    if (notesTextarea && savedNotes) {
        notesTextarea.value = savedNotes;
    } else if (notesTextarea) {
        notesTextarea.value = '';
    }
}

function savePersonalNotes(topicId) {
    if (!topicId || !currentUser) return;
    
    const notesTextarea = document.getElementById('personalNotes');
    if (!notesTextarea) return;
    
    const notesKey = `topic_notes_${currentUser.id}_${topicId}`;
    const notes = notesTextarea.value.trim();
    
    if (notes) {
        localStorage.setItem(notesKey, notes);
        showSuccessMessage('Anotações salvas com sucesso!');
    } else {
        localStorage.removeItem(notesKey);
        showSuccessMessage('Anotações removidas.');
    }
}

function toggleNotesSection() {
    const notesSection = document.getElementById('personalNotesSection');
    const toggleBtn = document.getElementById('toggleNotesBtn');
    
    if (!notesSection || !toggleBtn) return;
    
    const isVisible = notesSection.style.display !== 'none';
    
    if (isVisible) {
        notesSection.style.display = 'none';
        toggleBtn.classList.remove('active');
    } else {
        notesSection.style.display = 'block';
        toggleBtn.classList.add('active');
        // Focus on textarea when opening
        const notesTextarea = document.getElementById('personalNotes');
        if (notesTextarea) {
            setTimeout(() => notesTextarea.focus(), 100);
        }
    }
}

function showSuccessMessage(message) {
    // Use global showSuccess if available, otherwise create temporary message
    if (typeof window.showSuccess === 'function') {
        window.showSuccess(message);
        return;
    }
    
    // Create or update a temporary success message
    let messageEl = document.getElementById('notesSuccessMessage');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'notesSuccessMessage';
        messageEl.className = 'notes-success-message';
        const notesSection = document.getElementById('personalNotesSection');
        if (notesSection) {
            notesSection.style.position = 'relative';
            notesSection.appendChild(messageEl);
        }
    }
    
    messageEl.textContent = message;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 2000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Close modal when clicking outside
    const modal = document.getElementById('topicModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeTopicModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentTopicId !== null) {
            closeTopicModal();
        }
    });
    
    // Toggle notes section
    const toggleNotesBtn = document.getElementById('toggleNotesBtn');
    if (toggleNotesBtn) {
        toggleNotesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleNotesSection();
        });
    }
    
    // Save notes button
    const saveNotesBtn = document.getElementById('saveNotesBtn');
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentTopicId) {
                savePersonalNotes(currentTopicId);
            }
        });
    }
    
    // Auto-save notes on blur (when user leaves the textarea)
    const notesTextarea = document.getElementById('personalNotes');
    if (notesTextarea) {
        notesTextarea.addEventListener('blur', () => {
            if (currentTopicId) {
                savePersonalNotes(currentTopicId);
            }
        });
        
        // Auto-save on Ctrl+S or Cmd+S
        notesTextarea.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (currentTopicId) {
                    savePersonalNotes(currentTopicId);
                }
            }
        });
    }
});
