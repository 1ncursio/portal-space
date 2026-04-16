import { SvelteMap } from 'svelte/reactivity'
import type { PlayerInfo, PlayerStatus, ChatImage, ChatMessage } from '$lib/types'

const MAX_CHAT_MESSAGES = 50

class GameStore {
	players = new SvelteMap<string, PlayerInfo>()
	selfId = $state<string | null>(null)
	chatMessages = $state<ChatMessage[]>([])
	currentStatus = $state<PlayerStatus>('online')
	currentCustomStatus = $state<string>('')
	chatInputActive = $state(false)

	get playerCount() {
		return this.players.size
	}

	addChatMessage({
		senderId,
		nickname,
		nicknameColor,
		text,
		image,
	}: {
		senderId?: string
		nickname: string
		nicknameColor?: string
		text?: string
		image?: ChatImage
	}): void {
		if (!text && !image) return

		this.chatMessages.push({
			senderId,
			nickname,
			nicknameColor,
			text,
			image,
			isSystem: false,
			timestamp: Date.now(),
		})
		if (this.chatMessages.length > MAX_CHAT_MESSAGES) {
			this.chatMessages.splice(0, this.chatMessages.length - MAX_CHAT_MESSAGES)
		}
	}

	addSystemMessage(text: string): void {
		this.chatMessages.push({ text, isSystem: true, timestamp: Date.now() })
		if (this.chatMessages.length > MAX_CHAT_MESSAGES) {
			this.chatMessages.splice(0, this.chatMessages.length - MAX_CHAT_MESSAGES)
		}
	}
}

export const gameState = new GameStore()
