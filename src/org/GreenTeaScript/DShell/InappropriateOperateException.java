package org.GreenTeaScript.DShell;


public class InappropriateOperateException extends RelatedSyscallException {
	private static final long serialVersionUID = 1L;

	public InappropriateOperateException(String message, String commandName, String[] syscalls) {
		super(message, commandName, syscalls);
	}
}